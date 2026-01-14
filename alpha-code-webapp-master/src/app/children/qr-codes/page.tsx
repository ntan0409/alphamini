"use client"

import React from "react"
import QRCodesManager from "@/components/qr/qr-codes-manager"
import ProtectAddon from "@/components/protect-addon"

export default function ChildrenQRCodesPage() {
  return <>
    <ProtectAddon category={2}>
      <QRCodesManager />
    </ProtectAddon>
  </>
}
