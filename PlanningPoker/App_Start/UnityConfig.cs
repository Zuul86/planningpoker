namespace PlanningPoker.App_Start
{
    using Microsoft.Practices.Unity;

    public static class UnityConfig
    {
        public static void RegisterTypes(IUnityContainer container)
        {
            container.RegisterTypes(
                AllClasses.FromLoadedAssemblies(), 
                WithMappings.FromMatchingInterface, 
                WithName.Default, 
                WithLifetime.ContainerControlled);
        }
    }
}