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
  const segments = path.split("/").filter(Boolean)

  return (
    <div className="flex items-center gap-2 px-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((seg, i) => (
            <React.Fragment key={i}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {i === segments.length - 1 ? (
                  <BreadcrumbPage className="capitalize">{seg}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={`/${segments.slice(0, i + 1).join("/")}`} className="capitalize">
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
