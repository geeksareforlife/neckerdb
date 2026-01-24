export const html = `<a class="flex flex-col bg-gray-100 overflow-hidden rounded-lg bg-white shadow" href="{{ .RelPermalink }}">
        <div class="py-3 divide-y">
          <div class="px-2 mb-3 text-xs">
          {{- partial "necker.html" . -}}
          </div>
          <div class="pt-2 px-2 mb-auto text-center text-xl lg:text-base">{{ .Title }}</div>
        </div>
      </a>`;