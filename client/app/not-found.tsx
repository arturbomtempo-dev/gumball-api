import { ButtonLink } from '@/components/ButtonLink';
import { Container } from '@/components/Container';

export default function NotFound() {
    return (
        <Container className="flex flex-col items-start gap-6 py-24 sm:py-32">
            <p className="font-mono text-sm text-brand">404</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                This page wandered off
            </h1>
            <p className="max-w-md text-lg leading-8 text-muted">
                Like most things in Elmore, it is not where you expected. Try the docs or head back
                home.
            </p>
            <div className="flex gap-3">
                <ButtonLink href="/">Back home</ButtonLink>
                <ButtonLink href="/docs" variant="secondary">
                    Read the docs
                </ButtonLink>
            </div>
        </Container>
    );
}
