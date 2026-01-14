"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useQueryString } from "@/utils/utils"
import { Lock, Eye, EyeOff, ArrowLeft, Shield, AlertCircle } from "lucide-react"
import { resetPassword } from "@/features/auth/api/auth-api"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

export default function ResetPasswordForm() {

  const router = useRouter()
  const queryString: { token?: string } = useQueryString();
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null)

  // Check token existence
  useEffect(() => {
    if (typeof queryString.token === "string" && queryString.token.length > 0) {
      setTokenValid(true)
    } else {
      setTokenValid(false)
    }
  }, [queryString.token])

  // Validate passwords match
  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp.')
    } else {
      setError(null)
    }
  }, [newPassword, confirmPassword])

  // Check password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(null)
      return
    }
    
    const hasLower = /[a-z]/.test(newPassword)
    const hasUpper = /[A-Z]/.test(newPassword)
    const hasNumber = /\d/.test(newPassword)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    const isLongEnough = newPassword.length >= 6

    const score = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough].filter(Boolean).length

    if (score < 3) setPasswordStrength('weak')
    else if (score < 5) setPasswordStrength('medium')
    else setPasswordStrength('strong')
  }, [newPassword])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return

    if (!newPassword || !confirmPassword) {
  setError('Mật khẩu quá ngắn hoặc chưa đủ mạnh.')
      return
    }

    if (newPassword !== confirmPassword) {
  setError('Mật khẩu không khớp.')
      return
    }

    if (passwordStrength === 'weak') {
  setError('Mật khẩu quá ngắn hoặc chưa đủ mạnh.')
      return
    }

    if (!tokenValid) {
  setError('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.')
      return
    }

    setError(null)
    try {
      setLoading(true)
      const response = await resetPassword(queryString.token as string, newPassword)
      toast.success(response || 'Đặt lại mật khẩu thành công!')
      setNewPassword("")
      setConfirmPassword("")
      router.push("/login")
    } catch (error) {
      let message = 'Có lỗi xảy ra. Vui lòng thử lại.';
      if (typeof error === "object" && error !== null) {
        if ("response" in error && typeof error.response === "object" && error.response !== null && "msg" in error.response) {
          message = (error.response as { msg?: string }).msg || message;
        } else if ("message" in error && typeof (error as { message?: string }).message === "string") {
          message = (error as { message?: string }).message || message;
        }
      }
      setError(message);
    } finally {
      setLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 shadow-2xl shadow-gray-500/20">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg">
                <AlertCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</h2>
            <p className="text-gray-600">
              Vui lòng gửi lại yêu cầu đặt lại mật khẩu.
            </p>
            <div className="pt-4">
              <Link href="/reset-password/request">
                <Button className="w-full text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800">
                  Gửi yêu cầu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-green-500'
      default: return 'bg-gray-300'
    }
  }

  const getPasswordStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak': return 'w-1/3'
      case 'medium': return 'w-2/3'
      case 'strong': return 'w-full'
      default: return 'w-0'
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 shadow-2xl shadow-gray-500/20">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg shadow-green-400/30">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu mới</h1>
              <p className="text-gray-600 mt-2">
                Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                Mật khẩu mới
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Nhập mật khẩu mới"
                  className="pl-10 pr-10 h-11 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Độ mạnh mật khẩu:</span>
                    <span className={`font-medium ${
                      passwordStrength === 'weak' ? 'text-red-500' :
                      passwordStrength === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {passwordStrength === 'weak' ? 'YẾU' : 
                       passwordStrength === 'medium' ? 'TRUNG BÌNH' : 
                       passwordStrength === 'strong' ? 'MẠNH' : ''}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()} ${getPasswordStrengthWidth()}`}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Nhập lại mật khẩu mới"
                  className="pl-10 pr-10 h-11 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              className="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg shadow-green-400/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang đặt lại...
                </div>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Đặt lại mật khẩu
                </>
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="text-center pt-4 border-t border-gray-200">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}