namespace PlanningPoker
{
    using System.Collections.Generic;

    public interface ICardSelections
    {
        IDictionary<string, IList<CardSelection>> Selections { get; }

        void StoreCardSelection(string tableId, CardSelection cardSelection);

        void ClearCardSelections(string tableId);
    }
}