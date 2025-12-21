interface StatCardProps {
    value: string | number;
    label: string;
    icon?: React.ReactNode;
}

/**
 * Stat Card Component
 * 显示统计数字的卡片组件
 */
export function StatCard({ value, label, icon }: StatCardProps) {
    return (
        <div className="text-center">
            {icon && (
                <div className="flex justify-center mb-2 text-light-text-primary dark:text-dark-text-primary">
                    {icon}
                </div>
            )}
            <div className="text-4xl sm:text-5xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                {value}
            </div>
            <div className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary font-medium">
                {label}
            </div>
        </div>
    );
}
