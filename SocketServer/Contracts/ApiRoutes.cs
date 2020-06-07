namespace SocketServer.Contracts
{
    public static class ApiRoutes
    {
        public static class AccountRoutes
        {
            private const string AccountControllerRoute = "/account";
            public const string Register = AccountControllerRoute + "/register";
            public const string Login = AccountControllerRoute + "/login";

        }
    }
}
