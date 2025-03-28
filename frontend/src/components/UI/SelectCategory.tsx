import { useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { motion, Variants, MotionProps, AnimatePresence } from "motion/react";

export default function SelectCategory() {
    const [showCategory, setShowCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] =
        useState<string>("Toutes catégories");

    const handleCategories = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setShowCategory(!showCategory);
    };

    const selectCategory = (category: string) => {
        setSelectedCategory(category);
        setShowCategory(!showCategory);
    };

    const menuVariants: Variants = {
        closed: {
            scale: 0,
            transition: {
                delay: 0.15,
            },
        },
        open: {
            scale: 1,
            transition: {
                type: "spring",
                duration: 0.4,
                delayChildren: 0.2,
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants: MotionProps = {
        variants: {
            closed: { x: -16, opacity: 0 },
            open: { x: 0, opacity: 1 },
        },
        transition: { opacity: { duration: 0.2 } },
    };

    const categories = ["Toutes catégories", "Romans", "Mangas", "BD"];

    return (
        <div className="mx-auto flex w-[300px] flex-col gap-[10px]">
            <button
                className="bg-input border-border focus-visible:ring-ring flex w-full items-center justify-between rounded px-[10px] py-[9px] focus-visible:ring-1 focus-visible:outline-none"
                onClick={handleCategories}
            >
                <p className="font-bodyFont text-accent-foreground text-sm">
                    {selectedCategory}
                </p>
                <ChevronsUpDown className="text-accent-foreground h-4 w-4" />
            </button>
            <AnimatePresence>
                {showCategory && (
                    <motion.div
                        className="bg-input w-full rounded p-[10px]"
                        initial="closed"
                        animate={showCategory ? "open" : "closed"}
                        exit="closed"
                        variants={menuVariants}
                    >
                        {categories.map((category, i) => (
                            <motion.div
                                key={i}
                                className={`mb-[10px] flex cursor-pointer items-center justify-between rounded px-[10px] py-2 transition-colors last:mb-0 ${selectedCategory === category ? "bg-accent" : "hover:bg-accent"}`}
                                onClick={() => selectCategory(category)}
                                {...itemVariants}
                            >
                                <p className="font-bodyFont text-accent-foreground text-sm">
                                    {category}
                                </p>
                                {selectedCategory === category && (
                                    <Check className="text-accent-foreground h-[10px] w-[10px]" />
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
