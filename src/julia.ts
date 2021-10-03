function isSharedLibrary(name: string): boolean {
  return (
    name.endsWith(".dylib") || name.endsWith(".so") || name.endsWith(".dll")
  );
}

function isJuliaFile(name: string): boolean {
  return name.endsWith(".jl");
}

const completionSpec: Fig.Spec = {
  name: "julia",
  description: "The Julia Programming Language",
  options: [
    {
      name: ["-v", "--version"],
      description: "Display version information",
    },
    {
      name: ["-h", "--help"],
      description: "Print help message for julia (--help-hidden for more)",
    },
    {
      name: "--help-hidden",
      description: "Uncommon options not shown by `-h`",
    },
    {
      name: "--project",
      description: "Set given directory as the home project/environment",
      args: {
        name: "project",
        description: "Julia project/environment",
        isOptional: true,
        generators: {
          template: "folders",
          filterTemplateSuggestions: function (suggestions) {
            suggestions.push({
              name: "@.",
              priority: 75,
              description:
                "Search through parent directories until a Project.toml or JuliaProject.toml file is found",
            });
            return suggestions;
          },
        },
      },
    },
    {
      name: ["-J", "--sysimage"],
      insertValue: "-J '{cursor}'",
      description: "Start up with the given system image file",
      args: {
        name: "system image",
        generators: {
          template: "filepaths",
          filterTemplateSuggestions: function (paths) {
            return paths
              .filter((path) => {
                return isSharedLibrary(path.name) || path.name.endsWith("/");
              })
              .map((path) => {
                return {
                  ...path,
                  priority: isSharedLibrary(path.name) && 76,
                };
              });
          },
        },
      },
    },
    {
      name: ["-H", "--home"],
      description: "Set location of `julia` executable",
      args: {
        template: "folders",
      },
    },
    {
      name: "--startup-file",
      description: "Load `~/.julia/config/startup.jl`",
      args: {
        suggestions: [{ name: "yes" }, { name: "no" }],
      },
    },
    {
      name: "--handle-signals",
      description: "Enable or disable Julia's default signal handlers",
      args: {
        suggestions: [{ name: "yes" }, { name: "no" }],
      },
    },
    {
      name: "--sysimage-native-code",
      description: "Use native code from system image if available",
      args: {
        suggestions: [{ name: "yes" }, { name: "no" }],
      },
    },
    {
      name: "--compiled-modules",
      description: "Enable or disable incremental precompilation of modules",
      args: {
        suggestions: [{ name: "yes" }, { name: "no" }],
      },
    },
    {
      name: ["-e", "--eval"],
      insertValue: "-e '{cursor}'",
      description: "Evaluate given expr",
      args: {
        name: "expr",
      },
    },
    {
      name: ["-E", "--print"],
      insertValue: "-E '{cursor}'",
      description: "Evaluate given expr and display the result",
      args: {
        name: "expr",
      },
    },
    {
      name: ["-L", "--load"],
      insertValue: "-L '{cursor}'",
      description: "Load given file immediately on all processors",
      args: {
        name: "julia script",
        generators: {
          template: "filepaths",
          filterTemplateSuggestions: function (paths) {
            return paths
              .filter((path) => {
                return isJuliaFile(path.name) || path.name.endsWith("/");
              })
              .map((path) => {
                return {
                  ...path,
                  priority: isJuliaFile(path.name) && 76,
                };
              });
          },
        },
      },
    },
    {
      name: ["-t", "--threads"],
      description:
        'Enable N threads; "auto" sets N to the number of local CPU threads',
      args: {
        description: "Number of threads",
        suggestions: [{ name: "auto" }],
      },
    },
    {
      name: ["-p", "--procs"],
      description:
        'Integer value N launches N additional local worker processes "auto" launches as many workers as the number of local CPU threads',
      args: {
        description: "Number of additional local worker processes",
        suggestions: [{ name: "auto" }],
      },
    },
    {
      name: "--machine-file",
      description: "Run processes on hosts listed in given file",
      args: {
        template: "filepaths",
      },
    },
    {
      name: "-i",
      description: "Interactive mode; REPL runs and isinteractive() is true",
    },
    {
      name: ["-q", "--quiet"],
      description: "Quiet startup: no banner, suppress REPL warnings",
    },
    {
      name: "--banner",
      description: "Enable or disable startup banner",
      args: {
        suggestions: [{ name: "yes" }, { name: "no" }, { name: "auto" }],
      },
    },
    {
      name: "--color",
      description: "Enable or disable color text",
      args: {
        suggestions: [{ name: "yes" }, { name: "no" }, { name: "auto" }],
      },
    },
    {
      name: "--history-file",
      description: "Load or save history",
      args: {
        suggestions: [{ name: "yes" }, { name: "no" }],
      },
    },
    {
      name: "--depwarn",
      description:
        'Enable or disable syntax and method deprecation warnings ("error" turns warnings into errors)',
      args: {
        suggestions: [{ name: "yes" }, { name: "no" }, { name: "error" }],
      },
    },
    {
      name: "--warn-overwrite",
      description: "Enable or disable method overwrite warnings",
      args: {
        suggestions: [{ name: "yes" }, { name: "no" }],
      },
    },
    {
      name: "--warn-scope",
      description: "Enable or disable warning for ambiguous top-level scope",
      args: {
        suggestions: [{ name: "yes" }, { name: "no" }],
      },
    },
    {
      name: ["-C", "--cpu-target"],
      description:
        'Limit usage of CPU features up to <target>; set to "help" to see the available options',
      args: {},
    },
    {
      name: ["-O", "--optimize"],
      description:
        "Set the optimization level (default level is 2 if unspecified or 3 if used without a level)",
      args: {
        name: "level",
        description: "Level of optimization",
        isOptional: true,
      },
    },
    {
      name: "-g",
      description:
        "Enable / Set the level of debug info generation (default level is 1 if unspecified or 2 if used without a level)",
      args: {
        name: "level",
        description: "Level of debug info generation",
        isOptional: true,
      },
    },
    {
      name: "--inline",
      description:
        "Control whether inlining is permitted, including overriding @inline declarations",
      args: {
        suggestions: [{ name: "yes" }, { name: "no" }],
      },
    },
    {
      name: "--check-bounds",
      description:
        "Emit bounds checks always, never, or respect @inbounds declarations",
      args: {
        suggestions: [{ name: "yes" }, { name: "no" }, { name: "auto" }],
      },
    },
    {
      name: "--math-mode",
      description:
        "Disallow or enable unsafe floating point optimizations (overrides @fastmath declaration)",
      args: {
        suggestions: [{ name: "ieee" }, { name: "fast" }],
      },
    },
    {
      name: "--code-coverage",
      description:
        'Count executions of source lines (omitting setting is equivalent to "user")',
      args: {
        isOptional: true,
        suggestions: [{ name: "none" }, { name: "user" }, { name: "all" }],
      },
    },
    {
      name: "--track-allocation",
      description:
        'Count bytes allocated by each source line (omitting setting is equivalent to "user")',
      args: {
        isOptional: true,
        suggestions: [{ name: "none" }, { name: "user" }, { name: "all" }],
      },
    },
  ],
  args: {
    name: "julia script",
    isScript: true,
    generators: {
      filterTemplateSuggestions: function (paths) {
        return paths
          .filter((path) => {
            return isJuliaFile(path.name) || path.name.endsWith("/");
          })
          .map((path) => {
            return {
              ...path,
              priority: isJuliaFile(path.name) && 76,
            };
          });
      },
    },
  },
};
export default completionSpec;
