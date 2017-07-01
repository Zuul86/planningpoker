namespace PlanningPoker
{
    using Microsoft.Practices.Unity;

    public class DependencyResolver : IDependencyResolver
    {
        public T Resolve<T>()
        {
            return MvcApplication.Container.Resolve<T>();
        }
    }
}