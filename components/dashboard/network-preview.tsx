import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { NetworkGraph } from "@/lib/types"
import { UserCircle2 } from "lucide-react"

interface NetworkPreviewProps {
  graph: NetworkGraph | null
}

export function NetworkPreview({ graph }: NetworkPreviewProps) {
  if (!graph) {
    return (
      <Card className="h-full border-border/70 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Network radar</CardTitle>
          <CardDescription>Complete onboarding to unlock your graph.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const radius = 120
  const center = { x: radius + 12, y: radius + 12 }
  const nodesWithPosition = graph.nodes.map((node, index) => {
    if (index === 0) {
      return { ...node, x: center.x, y: center.y }
    }
    const angle = (index / (graph.nodes.length - 1)) * Math.PI * 2
    const distance = radius * 0.75
    return {
      ...node,
      x: center.x + Math.cos(angle) * distance,
      y: center.y + Math.sin(angle) * distance,
    }
  })

  return (
    <Card className="h-full border-border/70 bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg">Network radar</CardTitle>
        <CardDescription>
          Explore who&apos;s one introduction away—perfect for coffee chats and community warm intros.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <svg
            className="h-[260px] w-[260px] flex-shrink-0"
            viewBox={`0 0 ${(radius + 12) * 2} ${(radius + 12) * 2}`}
          >
            <defs>
              <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
              </radialGradient>
            </defs>
            {graph.links.map((link, index) => {
              const source = nodesWithPosition.find((node) => node.id === link.source)
              const target = nodesWithPosition.find((node) => node.id === link.target)
              if (!source || !target) return null
              return (
                <line
                  key={`${link.source}-${link.target}-${index}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  className="stroke-border/70"
                  strokeWidth={1.5}
                />
              )
            })}
            {nodesWithPosition.map((node, index) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={index === 0 ? 22 : 14}
                  fill={index === 0 ? "url(#nodeGradient)" : "white"}
                  className={index === 0 ? "stroke-primary/50" : "stroke-border"}
                  strokeWidth={index === 0 ? 3 : 1.5}
                />
                <text
                  x={node.x}
                  y={node.y + (index === 0 ? 32 : 24)}
                  className="fill-muted-foreground text-[10px] font-medium"
                  textAnchor="middle"
                >
                  {node.name.split(" ")[0]}
                </text>
              </g>
            ))}
          </svg>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Relationships
              </p>
              <Separator className="my-3" />
            </div>
            <ul className="space-y-3">
              {graph.links.map((link) => {
                const source = graph.nodes.find((node) => node.id === link.source)
                const target = graph.nodes.find((node) => node.id === link.target)
                if (!source || !target) return null
                return (
                  <li
                    key={`${link.source}-${link.target}`}
                    className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3"
                  >
                    <UserCircle2 className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm leading-5">
                      <p className="font-medium text-foreground">
                        {source.name} → {target.name}
                      </p>
                      <p className="text-muted-foreground">{link.relationship}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
