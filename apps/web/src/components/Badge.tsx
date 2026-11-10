import type { ReactNode } from 'react';
type Tone = 'neutral' | 'purple' | 'danger' | 'success' | 'warning';
export function Badge({children,tone='neutral'}:{children:ReactNode;tone?:Tone}) { return <span className={`badge badge-${tone}`}>{children}</span>; }
export function ResultBadge({value}:{value:string}) { const tone:Tone=value==='Passed'?'success':value==='Failed'?'danger':value==='Reproduced'?'purple':'neutral'; return <Badge tone={tone}>{value}</Badge>; }
