export type RobotInfo = {
    serial_number: string
    firmware_version: string
    ctrl_version: string
    battery_level: string
    is_charging: boolean
}

export type RobotInfoResponse = {
    status: string
    message: string
    data: RobotInfo
}