import PageLayout from '../components/layout/PageLayout';
import LoginForm from '../components/login/LoginForm';

export default function Login() {
  return (
    <PageLayout showFooter={false} contentClassName="min-h-screen flex items-center justify-center p-8">
      <LoginForm />
    </PageLayout>
  );
}
