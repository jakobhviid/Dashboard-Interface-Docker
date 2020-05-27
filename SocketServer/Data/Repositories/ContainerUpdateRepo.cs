namespace SocketServer.Data.Repositories
{
    public class ContainerUpdateRepo : IContainerUpdateRepo
    {
        private readonly DataContext _context;
        public ContainerUpdateRepo(DataContext context)
        {
            _context = context;
        }
    }
}
