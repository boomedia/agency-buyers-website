import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useLogin } from '~/auth/hooks/useLogin'
import { useAuth } from '~/auth/context/AuthContext'
import { POST_LOGIN_REDIRECT_KEY } from '~/auth/constants'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [redirectTo, setRedirectTo] = useState('/');

  useEffect(() => {
    const savedPath = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);

    if (savedPath && !savedPath.includes('login') && savedPath !== redirectTo) {
      setRedirectTo(savedPath)
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);

      sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);

      setUser(user);
      navigate(redirectTo, {replace: true});
    } catch {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-md">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
