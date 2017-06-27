using System;
using System.Collections.Generic;

namespace PlanningPoker
{
    public class CardSelections : ICardSelections
    {
        private static readonly IDictionary<string, IList<CardSelection>> _selections = new Dictionary<string, IList<CardSelection>>();

        public IDictionary<string, IList<CardSelection>> Selections { get { return _selections; } }

        public void ClearCardSelections(string tableId)
        {
            _selections[tableId].Clear();
        }

        public void StoreCardSelection(string tableId, CardSelection cardSelection)
        {
            if (_selections.ContainsKey(tableId))
            {
                _selections[tableId].Add(cardSelection);
            }
            else
            {
                _selections.Add(tableId, new List<CardSelection> { cardSelection });
            }
        }
    }
}