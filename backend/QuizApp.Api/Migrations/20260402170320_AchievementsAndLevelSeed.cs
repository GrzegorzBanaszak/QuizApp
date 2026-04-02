using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AchievementsAndLevelSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequiredLevelKey",
                table: "Avatars");

            migrationBuilder.AddColumn<string>(
                name: "Key",
                table: "Categories",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AchievementDefinitions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IconUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    TriggerType = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    RequiredLevelKey = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RequiredCategoryKey = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RequiredCompletedCategoriesCount = table.Column<int>(type: "int", nullable: true),
                    RewardType = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    RewardCoins = table.Column<int>(type: "int", nullable: true),
                    RewardAvatarKey = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AchievementDefinitions", x => x.Id);
                });

            migrationBuilder.Sql(
                """
                WITH normalized AS (
                    SELECT
                        Id,
                        BaseKey = NULLIF(
                            REPLACE(
                                REPLACE(
                                    REPLACE(
                                        REPLACE(
                                            REPLACE(
                                                REPLACE(
                                                    REPLACE(LOWER(LTRIM(RTRIM(Name))), ' ', '-'),
                                                '&', 'and'),
                                            '/', '-'),
                                        '\', '-'),
                                    '''', ''),
                                '.', ''),
                            ',', ''),
                        '')
                    FROM Categories
                ),
                resolved AS (
                    SELECT
                        Id,
                        BaseKey = COALESCE(BaseKey, CONCAT('category-', Id))
                    FROM normalized
                ),
                ranked AS (
                    SELECT
                        Id,
                        KeyValue = CASE
                            WHEN ROW_NUMBER() OVER (PARTITION BY BaseKey ORDER BY Id) = 1 THEN BaseKey
                            ELSE CONCAT(BaseKey, '-', ROW_NUMBER() OVER (PARTITION BY BaseKey ORDER BY Id))
                        END
                    FROM resolved
                )
                UPDATE categories
                SET [Key] = ranked.KeyValue
                FROM Categories categories
                INNER JOIN ranked ON ranked.Id = categories.Id;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "Key",
                table: "Categories",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Key",
                table: "Categories",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AchievementDefinitions_Code",
                table: "AchievementDefinitions",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AchievementDefinitions");

            migrationBuilder.DropIndex(
                name: "IX_Categories_Key",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Key",
                table: "Categories");

            migrationBuilder.AddColumn<string>(
                name: "RequiredLevelKey",
                table: "Avatars",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }
    }
}
