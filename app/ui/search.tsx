'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { fromEvent, map, filter, debounceTime } from 'rxjs';

export default function Search({ placeholder }: { placeholder: string }) {

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // 绑定input事件
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const inputObservable = fromEvent(searchRef.current!, 'input')
      .pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(300)  // 防抖处理，300ms 后才会触发
      )
      .subscribe(value => {
        console.log('处理后的输入值：', value);
        // 在这里可以进行进一步的处理或触发其他操作
        serachChangeHandle(value);
      });
  })

  /**
   * 处理查询输入框事件
   * 把查询关键词添加到URL中
   * 问：为什么不适用客户端->服务端 API模式？
   * 答：
   * @param trem query word
   */
  function serachChangeHandle(trem: string) {
    const params = new URLSearchParams(searchParams);
    if (trem) {
      params.set('query', trem);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        ref={searchRef}
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        // onChange={(e) => serachChangeHandle(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
