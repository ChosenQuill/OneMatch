interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 border-b border-border/60 pb-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-3">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-base text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>}
    </div>
  )
}
