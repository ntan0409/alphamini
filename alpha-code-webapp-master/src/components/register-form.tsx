'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRegisterAccount } from '@/features/auth/hooks/use-register'
import { RegisterAccount } from '@/types/account'


export default function RegisterForm() {
  const router = useRouter()
  // use the mutation object so we can call mutateAsync and read isLoading without TS narrowing issues
  const registerMutation = useRegisterAccount()

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: '',
    phone: '',
    gender: '0',
  })

  const passwordsMatch = formData.confirmPassword.length === 0 || formData.password === formData.confirmPassword


  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Vui lòng chọn ảnh hợp lệ'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Ảnh tối đa 5MB'); return }
    setAvatarFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) { toast.error('Mật khẩu không khớp'); return }
    try {
  await registerMutation.mutateAsync({
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        phone: formData.phone,
        gender: parseInt(formData.gender),
        avatarFile: avatarFile ?? undefined,
        // below fields required by Account but server sets others
        image: '', status: 1, bannedReason: null, createdDate: '', lastEdited: null, roleName: ''
              } as RegisterAccount)
      toast.success('Đăng ký thành công! Vui lòng đăng nhập')
      router.push('/login')
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message || 'Đăng ký thất bại')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0 shadow-[0_0_64px_0_rgba(0,0,0,0.12)]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Đăng ký tài khoản</h1>
                <p className="text-muted-foreground">Tạo tài khoản Alpha Mini để bắt đầu.</p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required aria-invalid={!passwordsMatch} />
                  {!passwordsMatch && formData.confirmPassword.length > 0 && (
                    <p className="text-sm text-red-600">Mật khẩu không khớp</p>
                  )}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label>Giới tính</Label>
                  <Select value={formData.gender} onValueChange={(v) => setFormData((p) => ({ ...p, gender: v }))}>
                    <SelectTrigger><SelectValue placeholder="Chọn giới tính" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Khác</SelectItem>
                      <SelectItem value="1">Nam</SelectItem>
                      <SelectItem value="2">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Ảnh đại diện</Label>
                  <div className="flex items-center gap-3">
                    <Input type="file" accept="image/*" onChange={handleFile} />
                    {previewUrl && (
                      <div className="w-10 h-10 rounded-full overflow-hidden border">
                        <Image src={previewUrl} alt="preview" width={40} height={40} className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-white font-semibold py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg transition transform duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600 hover:shadow-xl active:translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-300/40 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={registerMutation.isPending || !passwordsMatch}
              >
                {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>

              <div className="text-center text-sm">Đã có tài khoản? <a className="underline" href="/login">Đăng nhập</a></div>
            </div>
          </form>
          <div className="relative hidden md:block bg-white">
            <Image src="/img_signup.webp" alt="Alpha Mini" fill className="object-contain" priority />
            <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 120px rgba(255,255,255,0.9)' }} />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs">Khi đăng ký, bạn đồng ý với Điều khoản và Chính sách.</div>
    </div>
  )
}
