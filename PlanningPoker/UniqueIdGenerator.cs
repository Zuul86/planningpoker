namespace PlanningPoker
{
    using System;
    using System.Text;

    public class UniqueIdGenerator : IUniqueIdGenerator
    {
        public string GenerateShortUniqueId()
        {
            var base62chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".ToCharArray();

            var _random = new Random();

            var sb = new StringBuilder(6);

            for (int i = 0; i < 6; i++)
                sb.Append(base62chars[_random.Next(36)]);

            return sb.ToString();
        }
    }
}