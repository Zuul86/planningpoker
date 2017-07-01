namespace PlanningPoker.Tests
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Ploeh.AutoFixture;
    using Moq;
    using Ploeh.AutoFixture.AutoMoq;

    [TestClass]
    public class HttpHandlerFactoryTests
    {
        private IFixture _fixture;
        [TestMethod]
        public void GetHandlerReturnsPlanningPokerWebSocketHandler()
        {
            var dependancyResolverMock = new Mock<IDendencyResolver>();
            var handler = _fixture.Create<PlanningPokerWebSocketHandler>();
            dependancyResolverMock.Setup(x => x.Resolve<PlanningPokerWebSocketHandler>()).Returns(handler);
            var factory = new HttpHandlerFactory(dependancyResolverMock.Object);
            var result = factory.GetHandler(null, "get", "/PlanningPokerWebSocketHandler.ashx", "");
            Assert.AreEqual(handler, result);
        }

        [TestMethod]
        public void GetHandlerReturnsNull()
        {
            var dependancyResolverMock = new Mock<IDendencyResolver>();
            var handler = _fixture.Create<PlanningPokerWebSocketHandler>();
            dependancyResolverMock.Setup(x => x.Resolve<PlanningPokerWebSocketHandler>()).Returns(handler);
            var factory = new HttpHandlerFactory(dependancyResolverMock.Object);
            var result = factory.GetHandler(null, "get", "/", "");
            Assert.IsNull(result);
        }

        [TestInitialize]
        public void Initialize()
        {
            _fixture = new Fixture().Customize(new AutoMoqCustomization());
        }
    }
}
