using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class SingleplayerLevelUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SingleplayerQuestions_Levels_LevelId",
                table: "SingleplayerQuestions");

            migrationBuilder.DropForeignKey(
                name: "FK_SingleplayerResults_Users_UserId",
                table: "SingleplayerResults");

            migrationBuilder.DropColumn(
                name: "Difficulty",
                table: "Levels");

            migrationBuilder.RenameColumn(
                name: "LevelId",
                table: "SingleplayerQuestions",
                newName: "CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_SingleplayerQuestions_LevelId",
                table: "SingleplayerQuestions",
                newName: "IX_SingleplayerQuestions_CategoryId");

            migrationBuilder.AddColumn<Guid>(
                name: "GameSessionId",
                table: "SingleplayerResults",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "Difficulty",
                table: "SingleplayerQuestions",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "LevelQuestionDistributions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LevelId = table.Column<int>(type: "int", nullable: false),
                    Difficulty = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Count = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LevelQuestionDistributions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LevelQuestionDistributions_Levels_LevelId",
                        column: x => x.LevelId,
                        principalTable: "Levels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SingleplayerGameSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LevelId = table.Column<int>(type: "int", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SingleplayerGameSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SingleplayerGameSessions_Levels_LevelId",
                        column: x => x.LevelId,
                        principalTable: "Levels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SingleplayerGameSessions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SingleplayerGameSessionQuestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GameSessionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    QuestionOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SingleplayerGameSessionQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SingleplayerGameSessionQuestions_SingleplayerGameSessions_GameSessionId",
                        column: x => x.GameSessionId,
                        principalTable: "SingleplayerGameSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SingleplayerGameSessionQuestions_SingleplayerQuestions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "SingleplayerQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SingleplayerResults_GameSessionId",
                table: "SingleplayerResults",
                column: "GameSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_LevelQuestionDistributions_LevelId_Difficulty",
                table: "LevelQuestionDistributions",
                columns: new[] { "LevelId", "Difficulty" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SingleplayerGameSessionQuestions_GameSessionId_QuestionOrder",
                table: "SingleplayerGameSessionQuestions",
                columns: new[] { "GameSessionId", "QuestionOrder" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SingleplayerGameSessionQuestions_QuestionId",
                table: "SingleplayerGameSessionQuestions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_SingleplayerGameSessions_LevelId",
                table: "SingleplayerGameSessions",
                column: "LevelId");

            migrationBuilder.CreateIndex(
                name: "IX_SingleplayerGameSessions_UserId",
                table: "SingleplayerGameSessions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_SingleplayerQuestions_Categories_CategoryId",
                table: "SingleplayerQuestions",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SingleplayerResults_SingleplayerGameSessions_GameSessionId",
                table: "SingleplayerResults",
                column: "GameSessionId",
                principalTable: "SingleplayerGameSessions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SingleplayerResults_Users_UserId",
                table: "SingleplayerResults",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SingleplayerQuestions_Categories_CategoryId",
                table: "SingleplayerQuestions");

            migrationBuilder.DropForeignKey(
                name: "FK_SingleplayerResults_SingleplayerGameSessions_GameSessionId",
                table: "SingleplayerResults");

            migrationBuilder.DropForeignKey(
                name: "FK_SingleplayerResults_Users_UserId",
                table: "SingleplayerResults");

            migrationBuilder.DropTable(
                name: "LevelQuestionDistributions");

            migrationBuilder.DropTable(
                name: "SingleplayerGameSessionQuestions");

            migrationBuilder.DropTable(
                name: "SingleplayerGameSessions");

            migrationBuilder.DropIndex(
                name: "IX_SingleplayerResults_GameSessionId",
                table: "SingleplayerResults");

            migrationBuilder.DropColumn(
                name: "GameSessionId",
                table: "SingleplayerResults");

            migrationBuilder.DropColumn(
                name: "Difficulty",
                table: "SingleplayerQuestions");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "SingleplayerQuestions",
                newName: "LevelId");

            migrationBuilder.RenameIndex(
                name: "IX_SingleplayerQuestions_CategoryId",
                table: "SingleplayerQuestions",
                newName: "IX_SingleplayerQuestions_LevelId");

            migrationBuilder.AddColumn<string>(
                name: "Difficulty",
                table: "Levels",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_SingleplayerQuestions_Levels_LevelId",
                table: "SingleplayerQuestions",
                column: "LevelId",
                principalTable: "Levels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SingleplayerResults_Users_UserId",
                table: "SingleplayerResults",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
