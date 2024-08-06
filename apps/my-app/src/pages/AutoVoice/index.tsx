import type { ProFormInstance } from '@ant-design/pro-components';
import { ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { generate } from './generate';

export default () => {
  const formRef = useRef<
    ProFormInstance<{
      words?: string;
    }>
  >();
  return (
    <ProForm<{
      words?: string;
    }>
      onFinish={async () => {
        try {
          const vals = await formRef.current?.validateFields();
          await generate(vals?.words);
          message.success('generate success');
        } catch (error) {
          message.error('generate fail' + (error as Error).message);
        }
      }}
      formRef={formRef}
      formKey="base-form-use-demo"
      autoFocusFirstInput
    >
      <ProFormTextArea
        required
        rules={[
          {
            required: true,
          },
        ]}
        placeholder="split different words in different lines"
        colProps={{ span: 24 }}
        name="words"
        label="Words"
      />
    </ProForm>
  );
};
