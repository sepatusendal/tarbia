import { GithubIcon, InstagramIcon } from "@/components/icons/brand-icons"

export function SocialLinks() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1">
      <a
        href="https://github.com/sepatusendal"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub wira"
        className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <GithubIcon className="size-4" />
      </a>
      <a
        href="https://instagram.com/wirarajaofficial"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram @wirarajaofficial"
        className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <InstagramIcon className="size-4" />
      </a>
    </div>
  )
}
