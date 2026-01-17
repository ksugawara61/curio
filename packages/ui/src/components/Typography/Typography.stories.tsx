import type { Story } from "@ladle/react";
import type { TypographyProps } from "./Typography";
import { Typography } from "./Typography";

export const Default: Story<TypographyProps> = () => (
  <Typography>
    This is a default paragraph with base typography styling.
  </Typography>
);

export const Heading1: Story<TypographyProps> = () => (
  <Typography as="h1" size="2xl">
    This is a Heading 1
  </Typography>
);

export const Heading2: Story<TypographyProps> = () => (
  <Typography as="h2" size="xl">
    This is a Heading 2
  </Typography>
);

export const Heading3: Story<TypographyProps> = () => (
  <Typography as="h3" size="lg">
    This is a Heading 3
  </Typography>
);

export const Heading4: Story<TypographyProps> = () => (
  <Typography as="h4" size="base">
    This is a Heading 4
  </Typography>
);

export const Heading5: Story<TypographyProps> = () => (
  <Typography as="h5" size="sm">
    This is a Heading 5
  </Typography>
);

export const Heading6: Story<TypographyProps> = () => (
  <Typography as="h6" size="sm">
    This is a Heading 6
  </Typography>
);

export const Sizes: Story<TypographyProps> = () => (
  <div className="flex flex-col gap-4">
    <Typography size="sm">
      Small size - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </Typography>
    <Typography size="base">
      Base size - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </Typography>
    <Typography size="lg">
      Large size - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </Typography>
    <Typography size="xl">
      Extra large size - Lorem ipsum dolor sit amet, consectetur adipiscing
      elit.
    </Typography>
    <Typography size="2xl">
      2XL size - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </Typography>
  </div>
);

export const Span: Story<TypographyProps> = () => (
  <Typography as="span" size="base">
    This is an inline span element with typography styling.
  </Typography>
);

export const Div: Story<TypographyProps> = () => (
  <Typography as="div" size="lg">
    This is a div element with large typography styling. It can contain multiple
    lines of text and will respect the prose classes from Tailwind.
  </Typography>
);

export const AllHeadings: Story<TypographyProps> = () => (
  <div className="flex flex-col gap-4">
    <Typography as="h1" size="2xl">
      Heading 1 (2xl)
    </Typography>
    <Typography as="h2" size="xl">
      Heading 2 (xl)
    </Typography>
    <Typography as="h3" size="lg">
      Heading 3 (lg)
    </Typography>
    <Typography as="h4" size="base">
      Heading 4 (base)
    </Typography>
    <Typography as="h5" size="sm">
      Heading 5 (sm)
    </Typography>
    <Typography as="h6" size="sm">
      Heading 6 (sm)
    </Typography>
    <Typography as="p" size="base">
      Paragraph (base)
    </Typography>
  </div>
);
