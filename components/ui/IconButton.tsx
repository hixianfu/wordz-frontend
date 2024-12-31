import { Button, ButtonProps } from "~/components/ui/button";

export function IconButton({ icon, ...props }: ButtonProps & { icon: React.ReactNode }) {
    return (
        <Button variant='ghost' {...props} className="rounded-full w-12">
            {icon}
        </Button>
    )
}