import DashboardSkeleton from "../../ui/skeletons";

/**
 * 通过添加(overview)文件夹来实现页面骨架加载优化
 * <Suspense fallback={your skelelton compoment}>
 * @returns 
 */
export default function Loading() {
    return <DashboardSkeleton/>
}