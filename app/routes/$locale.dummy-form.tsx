import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useTranslation } from "react-i18next";

export const handle = {
  i18nNamespaces: ['test'],
};

export async function action({ request }: ActionFunctionArgs) {
  return json({
    errors: {
      field: 'validation-error'
    }
  });
}

export default function () {
  const actionData = useActionData<typeof action>();
  const { t } = useTranslation('test');

  return (
    <>
      <section className="container mt-24">
        <Form method="post">
          <div className="form-group">
            <label htmlFor="data1" className="control-label">Input</label>
            <input type="text" id="data1" name="data1" className="form-control"/>
            {actionData?.errors?.field ? (<em>{t(actionData.errors.field)}</em>) : null}
          </div>
          <button className="btn btn-primary">Submit</button>
        </Form>
      </section>
    </>
  );
}