namespace PlanningPoker.Tests
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Ploeh.AutoFixture;
    using Ploeh.AutoFixture.AutoMoq;

    [TestClass]
    public class CardSelectionsTests
    {
        private IFixture _fixure;

        [TestMethod]
        public void StoreCardSelectionAddsSelection()
        {
            var cardSelections = new CardSelections();
            var tableId = _fixure.Create<string>();
            var selection = _fixure.Create<CardSelection>();
            cardSelections.StoreCardSelection(tableId, selection);
            Assert.AreEqual(selection.Effort, cardSelections.Selections[tableId][0].Effort);
        }

        [TestMethod]
        public void StoreCardSelectionAddsSelectionToExistingTable()
        {
            var cardSelections = new CardSelections();
            var tableId = _fixure.Create<string>();
            var selection = _fixure.Create<CardSelection>();
            cardSelections.StoreCardSelection(tableId, _fixure.Create<CardSelection>());
            cardSelections.StoreCardSelection(tableId, _fixure.Create<CardSelection>());
            Assert.AreEqual(2, cardSelections.Selections[tableId].Count);
        }

        [TestMethod]
        public void StoreCardSelectionAddsSelectionToSeparateTables()
        {
            var cardSelections = new CardSelections();
            var table1 = _fixure.Create<string>();
            var table2 = _fixure.Create<string>();
            var selection = _fixure.Create<CardSelection>();
            cardSelections.StoreCardSelection(table1, _fixure.Create<CardSelection>());
            cardSelections.StoreCardSelection(table2, _fixure.Create<CardSelection>());
            Assert.AreEqual(1, cardSelections.Selections[table1].Count);
            Assert.AreEqual(1, cardSelections.Selections[table2].Count);
        }

        [TestMethod]
        public void ClearCardSelections()
        {
            var cardSelections = new CardSelections();
            var tableId = _fixure.Create<string>();
            var selection = _fixure.Create<CardSelection>();
            cardSelections.StoreCardSelection(tableId, selection);
            Assert.AreEqual(1, cardSelections.Selections[tableId].Count);
            cardSelections.ClearCardSelections(tableId);
            Assert.AreEqual(0, cardSelections.Selections[tableId].Count);
        }

        [TestInitialize]
        public void Initialize()
        {
            _fixure = new Fixture().Customize(new AutoMoqCustomization());
        }
    }
}
