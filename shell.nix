{ pkgs ? import <nixpkgs> {} 
}:

pkgs.mkShell {
  name="scalev-dev-env";
  buildInputs = [
    pkgs.nodejs-14_x
    pkgs.git
  ];
  shellHook = ''
  export PATH=~/.npm-packages/bin:$PATH
  export NODE_PATH=~/.npm-packages/lib/node_modules
  echo "Welcome to Scalev Dev Env"
  echo "Install Language server"
  echo "Start Developing Scalev"
  zsh
  '';
}
