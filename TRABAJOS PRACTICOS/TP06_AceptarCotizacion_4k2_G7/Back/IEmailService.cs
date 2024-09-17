namespace ISW_TP6_MAIL
{
    public interface IEmailService
    {
        Task<string> SendEmailAsync(EmailDTO emailDTO);
    }
}
