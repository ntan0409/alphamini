'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useGoogleLogin, useLogin } from "@/features/auth/hooks/use-login"
import { LoginRequest } from "@/types/login"
import { auth, GoogleAuthProvider, signInWithPopup } from "@/config/firebase-config"

import logo2 from '../../public/logo2.png'
import alphamini2 from '../../public/alpha-mini-2.webp'
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const loginMutation = useLogin();
  const loginGoogleMutation = useGoogleLogin();

  // Clear error when user starts typing
  useEffect(() => {
    if (loginMutation.error && (formData.username || formData.password)) {
      loginMutation.reset();
    }
  }, [formData.username, formData.password, loginMutation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      loginGoogleMutation.mutate(token);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
  toast.error('Đăng nhập Google thất bại.');
      }
    }

  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getErrorMessage = () => {
    if (!loginMutation.error) return null;

    const error = loginMutation.error as Error & {
      response?: { status: number };
      message?: string;
    };
    if (error.response?.status === 404) {
      return 'Không tìm thấy endpoint.';
    }
    if (error.response?.status === 401) {
      return 'Sai tên đăng nhập hoặc mật khẩu.';
    }
    if (error.response?.status && error.response.status >= 500) {
      return 'Lỗi máy chủ. Vui lòng thử lại sau.';
    }
    return error.message || 'Đăng nhập thất bại.';
  };



  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-[0_0_64px_0_rgba(0,0,0,0.25)]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                  <Image
                    src={logo2}
                    alt="Alpha Logo"
                    width={50}
                    height={50}
                    className="object-contain hover:cursor-pointer"
                    onClick={() => {router.push('/')}}
                  />
                </div>
                <h1 className="text-2xl font-bold">Đăng nhập vào Alpha Code</h1>
                <p className="text-muted-foreground text-balance">
                  Nền tảng lập trình và điều khiển robot giáo dục thông minh.
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={loginMutation.isPending}
                  autoFocus
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <a
                    href="/reset-password/request"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                    tabIndex={-1}
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loginMutation.isPending}
                />
              </div>
              {loginMutation.error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{getErrorMessage()}</p>
                </div>
              )}
              <Button
                type="submit"
                variant="outline"
                className="w-full bg-black text-white hover:text-black"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="bg-card text-muted-foreground px-2 z-10 text-center">
                  Hoặc đăng nhập bằng
                </span>
                <div className="flex-grow border-t border-border"></div>
              </div>
              <div className="grid">
                <Button variant="outline" type="button" className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={loginMutation.isPending}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" width="24" height="24">
                    <path fill="#4285F4" d="M488 261.8c0-17.4-1.4-34-4.3-50.2H249v95h135.7c-5.9 31-23.9 57.2-50.8 74.8v62.1h82c48-44.2 75.1-109.4 75.1-181.7z" />
                    <path fill="#34A853" d="M249 492c68.1 0 125.1-22.5 166.8-61.2l-82-62.1c-22.7 15.2-51.8 24.1-84.8 24.1-65.2 0-120.5-44.1-140.2-103.5h-85.2v64.8C64.7 428.2 150.6 492 249 492z" />
                    <path fill="#FBBC05" d="M108.8 289.3c-4.9-14.9-7.6-30.8-7.6-47.3s2.7-32.4 7.6-47.3v-64.8h-85.2C10.4 162.6 0 200.6 0 242s10.4 79.4 23.6 112.1l85.2-64.8z" />
                    <path fill="#EA4335" d="M249 97.5c37.1 0 70.5 12.8 96.9 37.9l72.8-72.8C374.1 24.5 317.1 0 249 0 150.6 0 64.7 63.8 23.6 162.6l85.2 64.8c19.7-59.4 75-103.5 140.2-103.5z" />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Chưa có tài khoản? {" "}
                <a href="/signup" className="underline underline-offset-4">
                  Đăng ký
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={alphamini2}
              alt="Image"
              fill
              className="object-cover"
              priority
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
  Khi đăng nhập, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a>.
      </div>
    </div>
  )
}
