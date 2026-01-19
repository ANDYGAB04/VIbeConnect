using System;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AccountController(DataContext context) : BaseApiController
{

    [HttpPost("register")]//acount/register
    public async Task<ActionResult<AppUser>> Register(string username, string password)
    {
        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            UserName = username,
            PasswordHash = hmac.ComputeHash(Encoding.UTF32.GetBytes(password)),
            PasswordSalt = hmac.Key
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return user;
    }
}
