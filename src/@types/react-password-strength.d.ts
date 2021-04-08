import React from 'react'

declare module 'react-password-strength' {
  export default class ReactPasswordStrength {
    className?: string
    style?: object
    minLength?: number
    minScore?: number
    scoreWords?: 'weak' | 'okay'  | 'good'  | 'strong'  | 'stronger'
    inputProps?: { name: string; autoComplete: "on" | "off"; className: string }
  }
}