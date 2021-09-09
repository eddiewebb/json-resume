FROM cibuilds/hugo:0.84.4
RUN curl https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-1.2.1-linux-x86-64.tar.gz -o webp.tar.gz && \
   tar -xzf webp.tar.gz && \
   cd libwebp-1.2.1-linux-x86-64/ && \
   sudo mv bin/cwebp bin/dwebp /usr/local/bin/ && \
   cd .. && rm -rf libwebp-1.2.1-linux-x86-64
