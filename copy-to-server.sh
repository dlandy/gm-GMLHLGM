rsync -avz --exclude '.DS_Store' --exclude '.gitignore' --exclude '.git' --exclude 'copy-to-server.sh' --exclude 'README.md' \
  -e "ssh" --delete ./* erik@graspablemath.com:/srv/www/graspablemath.com/public_html/studies/gm-gestures/2.0
