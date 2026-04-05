import { WorkflowProvider } from '@/lib/workflow-context'
import { WorkflowRouter } from '@/components/workflow-router'

export default function Home() {
  return (
    <WorkflowProvider>
      <WorkflowRouter />
    </WorkflowProvider>
  )
}