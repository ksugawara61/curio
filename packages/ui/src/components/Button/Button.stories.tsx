import type { Story } from "@ladle/react";
import type { ButtonProps } from "./Button";
import { Button } from "./Button";

export const Default: Story<ButtonProps> = () => (
  <Button>Default Button</Button>
);

export const Primary: Story<ButtonProps> = () => (
  <Button variant="primary">Primary Button</Button>
);

export const Secondary: Story<ButtonProps> = () => (
  <Button variant="secondary">Secondary Button</Button>
);

export const Accent: Story<ButtonProps> = () => (
  <Button variant="accent">Accent Button</Button>
);

export const Neutral: Story<ButtonProps> = () => (
  <Button variant="neutral">Neutral Button</Button>
);

export const Ghost: Story<ButtonProps> = () => (
  <Button variant="ghost">Ghost Button</Button>
);

export const Link: Story<ButtonProps> = () => (
  <Button variant="link">Link Button</Button>
);

export const Sizes: Story<ButtonProps> = () => (
  <div className="flex flex-col gap-4">
    <Button size="xs" variant="primary">
      Extra Small
    </Button>
    <Button size="sm" variant="primary">
      Small
    </Button>
    <Button size="md" variant="primary">
      Medium
    </Button>
    <Button size="lg" variant="primary">
      Large
    </Button>
    <Button size="xl" variant="primary">
      Extra Large
    </Button>
  </div>
);

export const Block: Story<ButtonProps> = () => (
  <Button block variant="primary">
    Full Width Button
  </Button>
);

export const Disabled: Story<ButtonProps> = () => (
  <div className="flex gap-4">
    <Button disabled variant="primary">
      Disabled Primary
    </Button>
    <Button disabled variant="secondary">
      Disabled Secondary
    </Button>
  </div>
);

export const AllVariants: Story<ButtonProps> = () => (
  <div className="flex flex-col gap-4">
    <Button>Default</Button>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="accent">Accent</Button>
    <Button variant="neutral">Neutral</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="link">Link</Button>
  </div>
);
