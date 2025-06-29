"use client"

import { ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  description?: string
  showBackButton?: boolean
  backUrl?: string
}

export function PageHeader({ title, description, showBackButton = true, backUrl = "/dashboard" }: PageHeaderProps) {
  const router = useRouter()

  return (
    <motion.div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(backUrl)}
            className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <Home className="h-4 w-4 sm:hidden" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>}
        </div>
      </div>
    </motion.div>
  )
}
