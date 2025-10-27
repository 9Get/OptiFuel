FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["OptiFuel.API.csproj", "."]
RUN dotnet restore "OptiFuel.API.csproj"

COPY . .
RUN dotnet build "OptiFuel.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "OptiFuel.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OptiFuel.API.dll"]