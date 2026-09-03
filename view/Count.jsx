'use client'
import { use } from "react"

export default ({promise}) => {
  const c = use(promise)
  return c
}