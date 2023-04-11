# Dockerfile to build remix-i18n application. Note that the order of
# directives in this file should be optimized to take advantage of docker's
# layering mechanics. Carefully think before you edit this file.
#
# The following arguments should be set at build time, however sane defaults are
# also provded:
#
#     - BUILD_DATE
#     - BUILD_ID
#     - BUILD_REVISION
#     - BUILD_VERSION
#
# example commands:
#
# 	$ docker build . --file containerfile --tag remix-i18n             \
# 	      --build-arg BUILD_DATE="$(date -u +%Y-%m-%dT%H:%M:%SZ)"      \
# 	      --build-arg BUILD_ID="0001"                                  \
# 	      --build-arg BUILD_REVISION="$(git rev-parse --short=8 HEAD)" \
# 	      --build-arg BUILD_VERSION="1.0.0"
# 	$ docker inspect remix-i18n
# 	$ docker run --init --interactive --tty --rm --publish 3000:3000 --name remix-i18n remix-i18n
#
# Note that these commands work the same if using podman.



# Base image used for all future stages
ARG BASE_IMAGE=docker.io/library/node:20.17.0-bookworm-slim
FROM $BASE_IMAGE AS base
ENV NODE_ENV production



# Stage: Dependencies
# This stage installs all project dependencies, including both production and development packages.
# It sets up the environment needed for subsequent build and production stages.
FROM base as deps

WORKDIR /home/node
COPY --chown=node:node package.json package-lock.json ./

USER node
RUN npm clean-install --include dev



# Stage: Production Dependencies
# This stage removes unnecessary development dependencies, retaining only production packages.
# It creates a more streamlined environment, reducing the final image size and enhancing security.
FROM base as prod-deps

WORKDIR /home/node
COPY --from=deps --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --chown=node:node package.json package-lock.json ./

USER node
RUN npm prune --omit dev



# Stage: Build
# This stage compiles the application, generating the final build artifacts.
# The compiled output can then be used in the final production image.
FROM base as build

RUN apt-get update && apt-get install jq=1.6-2.1 --yes --no-install-recommends

WORKDIR /home/node
COPY --from=deps --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --chown=node:node ./ ./

USER node
RUN npm run build

# Collect build metadata such as build date, ID, revision, and version for traceability
ARG BUILD_DATE="1970-01-01T00:00:00.000Z"
ARG BUILD_ID="0000"
ARG BUILD_REVISION="00000000"
ARG BUILD_VERSION="0.0.0"

RUN jq --null-input '{ buildDate: env.BUILD_DATE, buildId: env.BUILD_ID, buildRevision: env.BUILD_REVISION, buildVersion: env.BUILD_VERSION }' > build-info.json



# Stage: Final Production Image
# This stage creates the final, minimal image for running the application in production.
# It includes only the necessary files and dependencies, optimized for runtime performance.
FROM base as final

WORKDIR /home/node

# COPY files in order of least → most likely to change to maximize layer caching
COPY --from=prod-deps --chown=node:node /home/node/package.json /home/node/package-lock.json ./
COPY --from=prod-deps --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=build --chown=node:node /home/node/build/ ./build/
COPY --from=build --chown=node:node /home/node/public/ ./public/
COPY --from=build --chown=node:node /home/node/build-info.json ./

# Add labels for OCI compliance, describing the build details and image metadata
# see: https://github.com/opencontainers/image-spec/blob/main/annotations.md
ARG BUILD_DATE="1970-01-01T00:00:00.000Z"
ARG BUILD_ID="0000"
ARG BUILD_REVISION="00000000"
ARG BUILD_VERSION="0.0.0"

LABEL org.opencontainers.image.created=${BUILD_DATE}
LABEL org.opencontainers.image.revision=${BUILD_REVISION}
LABEL org.opencontainers.image.version=${BUILD_VERSION}

ARG IMAGE_AUTHORS="Digital Technology Solutions"
ARG IMAGE_DESCRIPTION="Remix i18n Demo Application"
ARG IMAGE_TITLE="Remix i18n Demo Application"
ARG IMAGE_URL="https://github.com/DTS-STN/remix-i18n/"
ARG IMAGE_VENDOR="Employment and Social Development Canada"

LABEL org.opencontainers.image.authors=${IMAGE_AUTHORS}
LABEL org.opencontainers.image.description=${IMAGE_DESCRIPTION}
LABEL org.opencontainers.image.title=${IMAGE_TITLE}
LABEL org.opencontainers.image.url=${IMAGE_URL}
LABEL org.opencontainers.image.vendor=${IMAGE_VENDOR}

USER node
ENV PORT=3000
CMD ["npm", "run", "start"]