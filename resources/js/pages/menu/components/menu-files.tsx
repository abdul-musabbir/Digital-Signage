import DeleteMenuComponent from './delete-menu';
import { Link } from '@inertiajs/react';
import { Calendar, Download, Edit3, Eye, FileText, HardDrive, ImageIcon, MoreVertical, Play } from 'lucide-react';

import { cn } from '@/lib/utils';
import DeleteMenu from '@/lib/wayfinder/actions/App/Domains/Menu/Actions/DeleteMenu';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Type definitions
interface FileItem {
    id: string | number;
    name: string;
    type: 'image' | 'video' | 'file';
    google_drive_url?: string;
    google_drive_id: string;
    size: number;
    created_at: string;
    extension?: string;
}

interface Menu {
    id: string | number;
    name: string;
    menus: FileItem[];
}

interface FileCardProps {
    file: FileItem;
}

interface ProfessionalFileCardsProps {
    menu: Menu;
}

interface TypeStyles {
    bg: string;
    border: string;
    text: string;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
    const getFileIcon = (): JSX.Element | null => {
        const iconProps = 'w-16 h-16 drop-shadow-sm';
        if (file.type === 'video') {
            return <Play className={`${iconProps} text-blue-500`} />;
        } else if (file.type === 'file') {
            return <FileText className={`${iconProps} text-violet-500`} />;
        }
        return null;
    };

    const renderPreview = (): JSX.Element => {
        if (file.type === 'image') {
            return (
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img
                        src={file.google_drive_url || ''}
                        alt={file.name}
                        className="h-full w-full object-cover transition-all duration-700 ease-out"
                    />

                    {/* Type Badge */}
                    <div className="absolute bottom-3 left-3">
                        <div className="rounded-lg bg-emerald-500/90 px-2 py-1 shadow-sm backdrop-blur-sm">
                            <span className="text-xs font-medium text-white">IMAGE</span>
                        </div>
                    </div>
                </div>
            );
        } else if (file.type === 'video') {
            return (
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-2xl border border-white/20 bg-white/15 p-6 shadow backdrop-blur-xl">
                            <Play className="h-12 w-12 text-blue-600 drop-shadow-lg" fill="currentColor" />
                        </div>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute bottom-3 left-3">
                        <div className="rounded-lg bg-blue-500/90 px-2 py-1 shadow-sm backdrop-blur-sm">
                            <span className="text-xs font-medium text-white">VIDEO</span>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-blue-300/20 blur-2xl" />
                    <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-indigo-300/20 blur-2xl" />
                </div>
            );
        } else {
            return (
                <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
                    <div className="relative z-10 flex flex-col items-center space-y-3">
                        {getFileIcon()}
                        <div className="rounded-lg bg-violet-500/90 px-3 py-1 shadow-sm backdrop-blur-sm">
                            <span className="text-xs font-medium text-white">{file.extension?.toUpperCase() || 'DOC'}</span>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-violet-200/30 blur-xl" />
                    <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-purple-200/30 blur-xl" />
                </div>
            );
        }
    };

    const getFileTypeIcon = (): JSX.Element => {
        const iconClass = 'w-4 h-4';
        if (file.type === 'image') {
            return <ImageIcon className={`${iconClass} text-emerald-600`} />;
        } else if (file.type === 'video') {
            return <Play className={`${iconClass} text-blue-600`} />;
        } else {
            return <FileText className={`${iconClass} text-violet-600`} />;
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const getTypeStyles = (): TypeStyles => {
        switch (file.type) {
            case 'image':
                return {
                    bg: 'bg-emerald-50/80',
                    border: 'border-emerald-200/60',
                    text: 'text-emerald-700',
                };
            case 'video':
                return {
                    bg: 'bg-blue-50/80',
                    border: 'border-blue-200/60',
                    text: 'text-blue-700',
                };
            default:
                return {
                    bg: 'bg-violet-50/80',
                    border: 'border-violet-200/60',
                    text: 'text-violet-700',
                };
        }
    };

    const typeStyles = getTypeStyles();

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">{renderPreview()}</CardContent>

            <CardFooter className="space-y-0 p-5">
                <div className="w-full space-y-4">
                    {/* File Info Header */}
                    <div className="flex items-start gap-3">
                        <div className={`rounded-xl border p-2.5 backdrop-blur-sm transition-all duration-300 ${typeStyles.bg} ${typeStyles.border}`}>
                            {getFileTypeIcon()}
                        </div>

                        <div className="w-full min-w-0 flex-1">
                            <div className="flex w-full items-center justify-between">
                                <h3 className="truncate text-sm font-semibold leading-tight text-gray-900 dark:text-white" title={file.name}>
                                    {file.name}
                                </h3>

                                <div>
                                    <Badge variant="outline" className="text-green-600">
                                        Active
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <HardDrive className="h-3 w-3" />
                                    <span className="font-medium">{formatFileSize(file.size)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(file.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 shrink-0 rounded-full p-0 opacity-0 transition-all duration-300 hover:bg-gray-100 group-hover:opacity-100"
                        >
                            <MoreVertical className="h-4 w-4 text-gray-400" />
                        </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="grid grid-cols-2 gap-1.5">
                            <Link
                                href={`${window.location.pathname}/${file.google_drive_id}`}
                                className={cn(
                                    buttonVariants({ variant: 'outline', size: 'sm' }),
                                    'h-9 rounded-lg px-2 text-xs font-medium transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700',
                                )}
                            >
                                <Eye className="mr-1 h-3.5 w-3.5" />
                                View
                            </Link>

                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 rounded-lg px-2 text-xs font-medium transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                                <Edit3 className="mr-1 h-3.5 w-3.5" />
                                Edit
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 rounded-lg px-2 text-xs font-medium transition-all duration-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                            >
                                <Download className="mr-1 h-3.5 w-3.5" />
                                Save
                            </Button>

                            <DeleteMenuComponent action={DeleteMenu.url(String(file.id))} />
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

const ProfessionalFileCards: React.FC<ProfessionalFileCardsProps> = ({ menu }) => {
    return (
        <div>
            <div>
                <h1 className="text-xl font-bold">{menu.name}</h1>
            </div>
            <Separator className="mb-4 mt-2" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {menu.menus.map((file) => (
                    <FileCard key={file.id} file={file} />
                ))}
            </div>
        </div>
    );
};

export default ProfessionalFileCards;
