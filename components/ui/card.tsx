import * as React from "react";
import { cn } from "@/lib/utils";

// Base Card component with hover effects
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { noHover?: boolean }
>(({ className, noHover, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow transition-transform duration-300 ease-in-out",
      // Apply hover effects unless `noHover` is true
      noHover && "hover:shadow-lg hover:scale-105 hover:border-primary",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// Card Header component
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// Card Title component
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight transition-colors duration-200 hover:text-primary",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// Card Description component
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground transition-colors duration-200 hover:text-muted", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// Card Content component
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Card Footer component with hover effect
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t border-muted", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Component for the six cards with hover effect
const FeaturesGrid = () => (
  <div className="grid grid-cols-3 gap-4">
    <Card>
      <CardHeader>
        <CardTitle>Advanced Detection</CardTitle>
        <CardDescription>Utilize machine learning algorithms for accurate fraud detection</CardDescription>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Real-time Analytics</CardTitle>
        <CardDescription>Monitor transactions and get insights in real-time</CardDescription>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Pattern Recognition</CardTitle>
        <CardDescription>Identify complex fraud patterns across your data</CardDescription>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Instant Alerts</CardTitle>
        <CardDescription>Receive immediate notifications on suspicious activities</CardDescription>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Customizable Rules</CardTitle>
        <CardDescription>Set up and fine-tune detection rules to fit your needs</CardDescription>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Easy Integration</CardTitle>
        <CardDescription>Seamlessly integrate with your existing systems</CardDescription>
      </CardHeader>
    </Card>
  </div>
);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, FeaturesGrid };
