export type MenuItem = {
    label: string
    icon?: string
    to?: string | object
    url?: string
    target?: string | '_blank'
    badge?: string
    badgeSeverity?: 'success' | 'info' | 'warning' | 'error'
    badgeClass?: string | object

    separator?: boolean

    style?: string | object
    class?: string | object

    items?: MenuItem[]

    disabled?: boolean | (() => boolean)
    visible?: boolean | (() => boolean)

    command?: (event: any) => void
}
