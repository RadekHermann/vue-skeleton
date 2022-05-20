export function darkModePreference(): boolean {
    return window.matchMedia('(prefers-color-scheme:dark)').matches
}

export function changeTheme(dark: boolean): void {
    const elementId = 'theme-link'
    const linkElement = document.getElementById(elementId)
    if (linkElement) {
        const cloneLinkElement = linkElement.cloneNode(true) as Element
        const newThemeUrl = linkElement.getAttribute('href')?.replace(`${dark ? 'light' : 'dark'}`, `${dark ? 'dark' : 'light'}`)
        cloneLinkElement?.setAttribute('id', elementId + '-clone')
        cloneLinkElement?.setAttribute('href', newThemeUrl || '')
        cloneLinkElement?.addEventListener('load', () => {
            linkElement.remove()
            cloneLinkElement.setAttribute('id', elementId)
        })
        linkElement.parentNode?.insertBefore(cloneLinkElement, linkElement.nextSibling)

        document.body.setAttribute('color-scheme', dark ? 'dark' : 'light')
    }
}
