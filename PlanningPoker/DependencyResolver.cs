namespace PlanningPoker
{
    using Microsoft.Practices.Unity;

    public class DependencyResolver : IDendencyResolver
    {
        public T Resolve<T>()
        {
            return MvcApplication.Container.Resolve<T>();
        }
    }
}