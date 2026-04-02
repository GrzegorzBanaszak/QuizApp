using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizApp.Api.Migrations
{
    public partial class SingleplayerQuestionSeed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Key",
                table: "SingleplayerQuestions",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE SingleplayerQuestions
                SET [Key] = CONCAT('question-', Id)
                WHERE [Key] IS NULL;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "Key",
                table: "SingleplayerQuestions",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SingleplayerQuestions_Key",
                table: "SingleplayerQuestions",
                column: "Key",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SingleplayerQuestions_Key",
                table: "SingleplayerQuestions");

            migrationBuilder.DropColumn(
                name: "Key",
                table: "SingleplayerQuestions");
        }
    }
}
