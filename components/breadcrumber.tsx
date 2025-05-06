// components/breadcrumb-bar.tsx
"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import React from "react"

export default function BreadcrumbBar() {
  const path = usePathname()
  const segments = path
    .replace("/dashboard", "") // Remove the "/dashboard" prefix
    .split("/") // Split the remaining path into segments
    .filter(Boolean); // Remove any empty segments

  return (
    <div className="flex items-center gap-2 ml-3 px-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden text-3xl text-white font-bold md:block">
            <BreadcrumbLink href="/dashboard">DashBoard</BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((seg, i) => (
            <React.Fragment key={i}>
              <BreadcrumbSeparator />
              <BreadcrumbItem className= "text-3xl text-white font-bold">
                {i === segments.length - 1 ? (
                  <BreadcrumbPage className="capitalize text-3xl text-white font-bold">{seg}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={`/${segments.slice(0, i + 1).join("/")}`} className="capitalize text-3xl text-white font-bold">
                    {seg}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
