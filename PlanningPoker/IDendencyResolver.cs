namespace PlanningPoker
{
    public interface IDependencyResolver
    {
        T Resolve<T>();
    }
}
